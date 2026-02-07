import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { userFields } from '../config/userFields';

function buildInitialValues(fields, value) {
  const initial = {};
  for (const f of fields) {
    initial[f.name] = value?.[f.name] ?? '';
  }
  return initial;
}

function validateAll(fields, values) {
  const nextErrors = {};
  for (const f of fields) {
    const err = f.validate ? f.validate(values[f.name], values) : null;
    if (err) nextErrors[f.name] = err;
  }
  return nextErrors;
}

export default function UserForm({ mode, value, onCancel, onSubmit, submitting }) {
  const [values, setValues] = React.useState(() => buildInitialValues(userFields, value));
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setValues(buildInitialValues(userFields, value));
    setErrors({});
  }, [value]);

  const title = mode === 'edit' ? 'Edit User' : 'Create User';

  const handleChange = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);

    const field = userFields.find((f) => f.name === name);
    const nextError = field?.validate ? field.validate(next[name], next) : null;
    setErrors((prev) => {
      const copy = { ...prev };
      if (nextError) copy[name] = nextError;
      else delete copy[name];
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateAll(userFields, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {};
    for (const f of userFields) payload[f.name] = values[f.name];

    await onSubmit(payload);
    if (mode !== 'edit') {
      setValues(buildInitialValues(userFields, null));
      setErrors({});
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {userFields.map((f) => (
          <Grid item xs={12} sm={6} key={f.name}>
            <TextField
              fullWidth
              required={Boolean(f.required)}
              label={f.label}
              name={f.name}
              type={f.type || 'text'}
              value={values[f.name]}
              onChange={handleChange(f.name)}
              error={Boolean(errors[f.name])}
              helperText={errors[f.name] || ' '}
              placeholder={f.placeholder || ''}
              inputProps={f.inputProps || undefined}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        {onCancel ? (
          <Button onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="contained" disabled={submitting}>
          {mode === 'edit' ? 'Save Changes' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
}
