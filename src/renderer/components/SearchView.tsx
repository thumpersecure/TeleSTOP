import React, { useState } from 'react';
import { PersonalInfo } from '../types';

interface SearchViewProps {
  personalInfo: PersonalInfo;
  onUpdateInfo: (info: PersonalInfo) => void;
  onSearch: (info: PersonalInfo) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ personalInfo, onUpdateInfo, onSearch }) => {
  const [info, setInfo] = useState<PersonalInfo>(personalInfo);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    onUpdateInfo(updated);
  };

  const handleAddItem = (field: 'emails' | 'phones' | 'addresses', value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      const updated = { ...info, [field]: [...info[field], value.trim()] };
      setInfo(updated);
      onUpdateInfo(updated);
      setter('');
    }
  };

  const handleRemoveItem = (field: 'emails' | 'phones' | 'addresses', index: number) => {
    const updated = { ...info, [field]: info[field].filter((_, i) => i !== index) };
    setInfo(updated);
    onUpdateInfo(updated);
  };

  const canSearch = info.fullName.trim() || info.emails.length > 0 || info.phones.length > 0 || info.addresses.length > 0;

  const ItemTag: React.FC<{ value: string; onRemove: () => void }> = ({ value, onRemove }) => (
    <span className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-full text-sm text-white">
      {value}
      <button onClick={onRemove} className="text-dark-400 hover:text-red-400 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Configure Your Search</h2>
          <p className="text-dark-400">
            Add or modify your personal information below. The more details you provide,
            the more thorough the search will be.
          </p>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
            <input
              type="text"
              value={info.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="John Michael Smith"
              className="browser-input"
            />
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">City</label>
                <input
                  type="text"
                  value={info.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Los Angeles"
                  className="browser-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">State</label>
                <input
                  type="text"
                  value={info.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="California"
                  className="browser-input"
                />
              </div>
            </div>
          </div>

          {/* Emails */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-300 mb-2">Email Addresses</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem('emails', newEmail, setNewEmail)}
                placeholder="Add an email address"
                className="browser-input flex-1"
              />
              <button
                onClick={() => handleAddItem('emails', newEmail, setNewEmail)}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            {info.emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {info.emails.map((email, i) => (
                  <ItemTag key={i} value={email} onRemove={() => handleRemoveItem('emails', i)} />
                ))}
              </div>
            )}
          </div>

          {/* Phones */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-300 mb-2">Phone Numbers</label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem('phones', newPhone, setNewPhone)}
                placeholder="Add a phone number"
                className="browser-input flex-1"
              />
              <button
                onClick={() => handleAddItem('phones', newPhone, setNewPhone)}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            {info.phones.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {info.phones.map((phone, i) => (
                  <ItemTag key={i} value={phone} onRemove={() => handleRemoveItem('phones', i)} />
                ))}
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className="card">
            <label className="block text-sm font-medium text-dark-300 mb-2">Addresses</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem('addresses', newAddress, setNewAddress)}
                placeholder="Add a street address"
                className="browser-input flex-1"
              />
              <button
                onClick={() => handleAddItem('addresses', newAddress, setNewAddress)}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            {info.addresses.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {info.addresses.map((address, i) => (
                  <ItemTag key={i} value={address} onRemove={() => handleRemoveItem('addresses', i)} />
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => onSearch(info)}
            disabled={!canSearch}
            className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
              canSearch
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg'
                : 'bg-dark-700 text-dark-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Start Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchView;
