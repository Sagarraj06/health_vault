#!/usr/bin/env python3
import os
import sys

# Set port to 5001 if 5000 is busy
os.environ['FLASK_PORT'] = '5001'

# Change to the correct directory
os.chdir('/Users/sagarraj/Desktop/Health_Vault1/health_vault/Backend/ai')
sys.path.insert(0, '/Users/sagarraj/Desktop/Health_Vault1/health_vault/Backend/ai')

# Import and run the app
from app import app
from waitress import serve

print("\n🚀 Starting AI Backend on port 5001...")
serve(app, host="0.0.0.0", port=5001)
