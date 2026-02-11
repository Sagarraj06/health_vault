'use client';

import React, { useState } from 'react';
import { 
  WalletIcon, 
  QrCodeIcon, 
  CreditCardIcon 
} from 'lucide-react';
import { 
  WagmiProvider, 
  useAccount, 
  useBalance, 
  useConnect, 
  useDisconnect 
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';
import { createConfig, http } from 'wagmi';
import { 
  metaMask, 
  coinbaseWallet, 
  walletConnect 
} from 'wagmi/connectors';
import QRCode from 'qr';

// Wagmi Configuration
const config = createConfig({
  chains: [mainnet],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'Medical App Payment' }),
    walletConnect({ projectId: '57a19addbc08f9f18acac8a38630dce9' })
  ],
  transports: {
    [mainnet.id]: http()
  }
});

const queryClient = new QueryClient();

const PaymentGateway = () => {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [paymentAmount] = useState(550.75);
  const [showQR, setShowQR] = useState(false);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen w-full bg-dark flex items-center justify-center p-4">
          <div className="w-full max-w-[1400px] glass-card grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6">
            {/* Left Payment Section */}
            <div className="lg:col-span-4 bg-white/[0.03] rounded-xl p-5 sm:p-6 flex flex-col gap-5 border border-white/[0.06]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <CreditCardIcon className="mr-2 text-primary" size={20} />
                  Payment
                </h2>
                <div className="text-primary text-sm font-medium">
                  Medical App
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white/[0.04] p-4 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-400">Total Amount</h3>
                    <span className="text-2xl font-bold text-white">
                      ${paymentAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <WalletConnector 
                  selectedWallet={selectedWallet} 
                  setSelectedWallet={setSelectedWallet}
                  setShowQR={setShowQR}
                />
              </div>
            </div>

            {/* Right Transaction Section */}
            <div className="lg:col-span-8 bg-white/[0.02] rounded-xl p-5 sm:p-6 border border-white/[0.06]">
              {showQR ? (
                <QRSection paymentAmount={paymentAmount} />
              ) : (
                <TransactionSection />
              )}
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const WalletConnector = ({ selectedWallet, setSelectedWallet, setShowQR }) => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  const handleWalletConnect = (connector) => {
    connect({ connector });
    setSelectedWallet('metaMaskWallet');
    setShowQR(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-gray-300">Wallet Options</h4>
      
      {!isConnected ? (
        <>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleWalletConnect(connector)}
              className={`w-full p-3.5 rounded-xl border flex justify-between items-center transition-all
                ${selectedWallet === 'metaMaskWallet' 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-white/[0.06] hover:border-white/10 bg-white/[0.02]'
                }`}
            >
              <div className="flex items-center">
                <WalletIcon className="mr-3 text-primary" size={18} />
                <span className="font-medium text-white text-sm">
                  {connector.name}
                </span>
              </div>
            </button>
          ))}
        </>
      ) : (
        <div className="bg-white/[0.04] p-4 rounded-xl border border-white/[0.06]">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <button 
              onClick={() => {
                disconnect();
                setShowQR(false);
              }}
              className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg text-xs transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const QRSection = ({ paymentAmount }) => {
  const { address } = useAccount();
  const [copyStatus, setCopyStatus] = useState('Copy');

  const paymentDetails = `Amount: $${paymentAmount}\nTo: Medical App\nAddress: ${address}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentDetails);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy'), 2000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <h2 className="text-xl font-bold text-white">Scan to Pay</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <QRCode 
          value={paymentDetails} 
          size={250} 
          level={'H'} 
          includeMargin={true}
          fgColor="#15803d"
        />
      </div>
      <div className="flex gap-3">
        <button 
          onClick={handleCopy}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          {copyStatus}
        </button>
        <button 
          className="bg-white/[0.06] text-gray-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/[0.1] transition-colors border border-white/[0.06]"
          onClick={() => window.print()}
        >
          Print QR
        </button>
      </div>
    </div>
  );
};

const TransactionSection = () => {
  const transactions = [
    {
      date: '2024-03-15',
      description: 'Cardiology Consultation',
      amount: 350.50,
      currency: 'USD',
      status: 'Completed'
    },
    {
      date: '2024-03-20',
      description: 'Advanced Prescription',
      amount: 450.25,
      currency: 'USD',
      status: 'Processing'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white mb-4">
          Wallet Transactions
        </h3>
        {transactions.map((transaction, index) => (
          <div 
            key={index} 
            className="bg-white/[0.03] p-3 rounded-xl mb-2 border border-white/[0.04]"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium text-white text-sm">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500">
                  {transaction.date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white text-sm">
                  {transaction.amount} {transaction.currency}
                </p>
                <p className={`text-xs font-medium ${transaction.status === 'Completed' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white mb-4">
          MetaMask Transactions
        </h3>
        <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.04]">
          <div className="flex justify-between">
            <div>
              <p className="font-medium text-gray-300 text-sm">
                Pending Connection
              </p>
              <p className="text-xs text-gray-500">
                Connect wallet to view transactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
