import React, { useState } from 'react'

interface URLInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: (url: string) => void
  isLoading: boolean
}

const URLInput: React.FC<URLInputProps> = ({ value, onChange, onGenerate, isLoading }) => {
  const [isValidUrl, setIsValidUrl] = useState(true)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return url.includes('rapidapi.com') || url.includes('openapi') || url.includes('swagger')
    } catch {
      return false
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    if (newValue) {
      setIsValidUrl(validateUrl(newValue))
    } else {
      setIsValidUrl(true)
    }
  }

  const handleGenerate = () => {
    if (!value.trim()) {
      setIsValidUrl(false)
      return
    }

    if (validateUrl(value)) {
      onGenerate(value)
    } else {
      setIsValidUrl(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate()
    }
  }

  return (
    <div className="url-input-section">
      <div className="input-group">
        <div className="input-wrapper">
          <input
            type="url"
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Paste your RapidAPI URL here... (e.g., https://rapidapi.com/api/..."
            className={`url-input ${!isValidUrl ? 'error' : ''}`}
            disabled={isLoading}
          />
          {!isValidUrl && (
            <div className="input-error">
              Please enter a valid RapidAPI URL or OpenAPI specification URL
            </div>
          )}
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isLoading || !value.trim()}
          className="generate-button"
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            <>
              <span>⚡</span>
              Generate Code
            </>
          )}
        </button>
      </div>

      <div className="example-urls">
        <p>Try these example URLs:</p>
        <div className="example-buttons">
          <button
            onClick={() => onChange('https://rapidapi.com/weatherapi/api/weatherapi-com')}
            className="example-button"
            disabled={isLoading}
          >
            Weather API
          </button>
          <button
            onClick={() => onChange('https://rapidapi.com/apidojo/api/yahoo-finance1')}
            className="example-button"
            disabled={isLoading}
          >
            Yahoo Finance
          </button>
          <button
            onClick={() => onChange('https://rapidapi.com/trueway/api/trueway-geocoding')}
            className="example-button"
            disabled={isLoading}
          >
            Geocoding API
          </button>
        </div>
      </div>
    </div>
  )
}

export default URLInput