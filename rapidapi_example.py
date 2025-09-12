#!/usr/bin/env python3
"""
RapidAPI Python Example

This example demonstrates how to securely use RapidAPI with environment variables.
Make sure to create a .env file with your RAPIDAPI_KEY before running this script.
"""

import os
import requests
from dotenv import load_dotenv

def main():
    # Load environment variables from .env file
    load_dotenv()
    
    # Get the API key from environment variables
    api_key = os.getenv('RAPIDAPI_KEY')
    
    if not api_key or api_key == 'your_super_secret_api_key':
        print("Error: Please set a valid RAPIDAPI_KEY in your .env file")
        print("Copy .env.example to .env and replace with your actual API key")
        return
    
    # Example API call using RapidAPI
    # This is a generic example - replace with your specific RapidAPI endpoint
    url = "https://api.rapidapi.com/example-endpoint"
    
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "api.rapidapi.com"  # Replace with actual host
    }
    
    try:
        print("Making API request...")
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            print("Success! API Response:")
            print(response.json())
        else:
            print(f"API request failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()