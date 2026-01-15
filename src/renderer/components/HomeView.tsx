import React, { useState } from 'react';
import { PersonalInfo } from '../types';

interface HomeViewProps {
  personalInfo: PersonalInfo;
  onUpdateInfo: (info: PersonalInfo) => void;
  onSearch: (info: PersonalInfo) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ personalInfo, onUpdateInfo, onSearch }) => {
  const [info, setInfo] = useState<PersonalInfo>(personalInfo);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    onUpdateInfo(updated);
  };

  const handleAddEmail = () => {
    if (newEmail.trim()) {
      const updated = { ...info, emails: [...info.emails, newEmail.trim()] };
      setInfo(updated);
      onUpdateInfo(updated);
      setNewEmail('');
    }
  };

  const handleAddPhone = () => {
    if (newPhone.trim()) {
      const updated = { ...info, phones: [...info.phones, newPhone.trim()] };
      setInfo(updated);
      onUpdateInfo(updated);
      setNewPhone('');
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      const updated = { ...info, addresses: [...info.addresses, newAddress.trim()] };
      setInfo(updated);
      onUpdateInfo(updated);
      setNewAddress('');
    }
  };

  const handleRemoveItem = (field: 'emails' | 'phones' | 'addresses', index: number) => {
    const updated = { ...info, [field]: info[field].filter((_, i) => i !== index) };
    setInfo(updated);
    onUpdateInfo(updated);
  };

  const canSearch = info.fullName.trim() || info.emails.length > 0 || info.phones.length > 0 || info.addresses.length > 0;

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Find & Remove Your Personal Information</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Enter your personal details below. TeleSTOP will search Google to find where your information
            appears on people-search sites, then guide you through removing it.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-800/30 rounded-xl mb-8">
          <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="font-medium text-green-400">Your Privacy is Protected</p>
            <p className="text-sm text-dark-400">
              All data is stored locally on your computer. Nothing is sent to external servers.
              Your personal information never leaves your machine.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid gap-6">
          {/* Name Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Name
            </h3>
            <input
              type="text"
              placeholder="Enter your full name (e.g., John Michael Smith)"
              value={info.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="browser-input"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="City (optional)"
                value={info.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="browser-input"
              />
              <input
                type="text"
                placeholder="State (optional)"
                value={info.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="browser-input"
              />
            </div>
          </div>

          {/* Email Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Addresses
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter an email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                className="browser-input flex-1"
              />
              <button onClick={handleAddEmail} className="btn-primary">Add</button>
            </div>
            {info.emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {info.emails.map((email, index) => (
                  <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-full text-sm">
                    {email}
                    <button
                      onClick={() => handleRemoveItem('emails', index)}
                      className="text-dark-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Phone Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Phone Numbers
            </h3>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="Enter a phone number (any format)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhone()}
                className="browser-input flex-1"
              />
              <button onClick={handleAddPhone} className="btn-primary">Add</button>
            </div>
            {info.phones.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {info.phones.map((phone, index) => (
                  <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-full text-sm">
                    {phone}
                    <button
                      onClick={() => handleRemoveItem('phones', index)}
                      className="text-dark-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Addresses
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter a street address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAddress()}
                className="browser-input flex-1"
              />
              <button onClick={handleAddAddress} className="btn-primary">Add</button>
            </div>
            {info.addresses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {info.addresses.map((address, index) => (
                  <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-full text-sm">
                    {address}
                    <button
                      onClick={() => handleRemoveItem('addresses', index)}
                      className="text-dark-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => onSearch(info)}
            disabled={!canSearch}
            className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
              canSearch
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg shadow-primary-500/25'
                : 'bg-dark-700 text-dark-400 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search for My Information
            </span>
          </button>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-dark-800/50 rounded-xl text-center">
              <div className="w-10 h-10 bg-primary-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white">Multi-Format Search</p>
              <p className="text-xs text-dark-400 mt-1">Searches multiple variations of your info</p>
            </div>
            <div className="p-4 bg-dark-800/50 rounded-xl text-center">
              <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white">Step-by-Step Guides</p>
              <p className="text-xs text-dark-400 mt-1">Detailed removal instructions</p>
            </div>
            <div className="p-4 bg-dark-800/50 rounded-xl text-center">
              <div className="w-10 h-10 bg-yellow-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white">Progress Tracking</p>
              <p className="text-xs text-dark-400 mt-1">Track your removal requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
