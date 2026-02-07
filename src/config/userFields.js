export const userFields = [
  {
    name: 'firstName',
    label: 'First Name',
    required: true,
    type: 'text',
    validate: (value) => {
      if (!value?.trim()) return 'First Name is required';
      if (value.trim().length < 2) return 'First Name must be at least 2 characters';
      return null;
    },
  },
  {
    name: 'lastName',
    label: 'Last Name',
    required: true,
    type: 'text',
    validate: (value) => {
      if (!value?.trim()) return 'Last Name is required';
      if (value.trim().length < 2) return 'Last Name must be at least 2 characters';
      return null;
    },
  },
  {
    name: 'phone',
    label: 'Phone Number',
    required: true,
    type: 'tel',
    placeholder: 'e.g. +1-555-0100',
    validate: (value) => {
      if (!value?.trim()) return 'Phone Number is required';
      const normalized = value.replace(/[\s()-]/g, '');
      if (!/^\+?[0-9]{7,15}$/.test(normalized)) return 'Phone Number is invalid';
      return null;
    },
  },
  {
    name: 'email',
    label: 'Email Address',
    required: true,
    type: 'email',
    placeholder: 'name@company.com',
    validate: (value) => {
      if (!value?.trim()) return 'Email Address is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Email Address is invalid';
      return null;
    },
  },
];
