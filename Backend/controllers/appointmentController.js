import { User, Appointment, Notification } from "../models/index.js";
import sendMail from "../utils/mailer.js";

export const bookAppointment = async (req, res) => {
  try {
    // console.log("Request body:", req.body);
    const { doctorId, slotDateTime } = req.body;
    const studentId = req.user.id;

    // Validate slotDateTime is in the future
    if (new Date(slotDateTime) < new Date()) {
      return res.status(400).json({ message: "Cannot book appointments in the past." });
    }

    // ATOMIC OPERATION: Try to find the doctor AND update the slot status in one go.
    // This prevents race conditions where two users book the same slot simultaneously.
    const updatedDoctor = await User.findOneAndUpdate(
      {
        _id: doctorId,
        "availableSlots.dateTime": slotDateTime,
        "availableSlots.isBooked": false // CRITICAL: Only match if currently unbooked
      },
      {
        $set: {
          "availableSlots.$.isBooked": true
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedDoctor) {
      return res.status(400).json({ message: "Time slot is not available or already booked." });
    }

    // Check if the student already has an appointment at this time (optional, but good practice)
    const existingAppointment = await Appointment.findOne({
      studentId,
      slotDateTime
    });

    if (existingAppointment) {
      // Rollback: If student already has an appointment, free the slot back up
      await User.findOneAndUpdate(
        {
          _id: doctorId,
          "availableSlots.dateTime": slotDateTime
        },
        {
          $set: { "availableSlots.$.isBooked": false }
        }
      );
      return res.status(400).json({ message: "You already have an appointment at this time." });
    }

    // Create the appointment
    const appointment = new Appointment({
      studentId,
      doctorId,
      slotDateTime
    });

    await appointment.save();

    const doctorDetails = await User.findById(doctorId).select("name email");
    const studentDetails = await User.findById(studentId).select("name");



    //storing in db 
    const notification = await Notification.create({
      recipientId: doctorId,
      type: "appointment",
      message: `📅 You have a new appointment request from ${studentDetails.name}!`
    });

    // console.log("✅ SAVED NOTIFICATION:", notification);

    //Notify the doc in realtime
    const io = req.app.get("socketio");
    const onlineUsers = req.app.get("onlineUsers"); // Get the online users Map

    if (onlineUsers.has(doctorId.toString())) {
      const doctorSocket = onlineUsers.get(doctorId.toString());
      // console.log(`Sending notification to doctor ${doctorId}`);
      doctorSocket.emit("newAppointment", {
        message: `📅 ${studentDetails.name} has requested an appointment!`,
        appointment: {
          ...appointment.toObject(),
          doctorId: {
            _id: doctorDetails._id,
            name: doctorDetails.name,
          },
          studentId: {
            _id: studentDetails._id,
            name: studentDetails.name,
          },
        },

      });
      doctorSocket.emit("newNotification", {
        notification,
      });

    }


    try {
      const mailSubject = "📅 New Appointment Request";
      const mailText = `You have a new appointment request from ${studentDetails.name} on ${slotDateTime}.`;
      const mailHtml = `
        <h3>New Appointment Request</h3>
        <p><strong>Student:</strong> ${studentDetails.name}</p>
        <p><strong>Date & Time:</strong> ${slotDateTime}</p>
        <p>Please log in to your dashboard to confirm or cancel this appointment.</p>
      `;
      // console.log(`...mail ....`,doctorDetails.email);
      await sendMail(
        doctorDetails.email,
        mailSubject,
        mailText,
        mailHtml,
      );

      // console.log("✅ Email sent to doctor:", doctorDetails.email);
    } catch (emailError) {
      console.error("❌ Error sending email:", emailError);
    }




    res.status(201).json({ message: "Appointment booked successfully.", appointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStudentAppointments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status } = req.query;

    const filter = { studentId };
    if (status) {
      filter.status = status;
    }
    const appointments = await Appointment.find(filter).populate(
      "doctorId",
      "name email specialization"
    );

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



