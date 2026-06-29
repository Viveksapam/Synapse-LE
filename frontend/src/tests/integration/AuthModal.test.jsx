import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthModal from '../../components/AuthModal';

const renderModal = (props = {}) => render(
  <MemoryRouter>
    <AuthModal
      onClose={vi.fn()}
      useAuthHook={{
        handleLogin: vi.fn(() => Promise.resolve()),
        handleRegister: vi.fn(() => Promise.resolve()),
      }}
      {...props}
    />
  </MemoryRouter>
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthModal integration', () => {
  it('renders login view by default', () => {
    renderModal();
    expect(screen.getByText('Welcome Back')).toBeDefined();
    expect(screen.getByPlaceholderText('Username')).toBeDefined();
    expect(screen.getByPlaceholderText('Password')).toBeDefined();
    expect(screen.getByText('Login')).toBeDefined();
  });

  it('does not show email field in login view', () => {
    renderModal();
    expect(screen.queryByPlaceholderText('Email')).toBeNull();
  });

  it('switches to register view', () => {
    renderModal();
    fireEvent.click(screen.getByText("Don't have an account? Register"));
    expect(screen.getByText('Create Account')).toBeDefined();
    expect(screen.getByPlaceholderText('Email')).toBeDefined();
    expect(screen.getByText('Register')).toBeDefined();
  });

  it('switches back to login view', () => {
    renderModal();
    fireEvent.click(screen.getByText("Don't have an account? Register"));
    fireEvent.click(screen.getByText('Already have an account? Login'));
    expect(screen.getByText('Welcome Back')).toBeDefined();
  });

  it('calls handleLogin on login form submit', async () => {
    const handleLogin = vi.fn(() => Promise.resolve());
    const onClose = vi.fn();

    renderModal({
      onClose,
      useAuthHook: { handleLogin, handleRegister: vi.fn() },
    });

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'alice' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith('alice', 'pass123');
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('calls handleRegister then handleLogin on register submit', async () => {
    const handleRegister = vi.fn(() => Promise.resolve());
    const handleLogin = vi.fn(() => Promise.resolve());
    const onClose = vi.fn();

    renderModal({
      onClose,
      useAuthHook: { handleLogin, handleRegister },
    });

    fireEvent.click(screen.getByText("Don't have an account? Register"));

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'bob' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'bob@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secure' } });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalledWith({
        username: 'bob',
        email: 'bob@test.com',
        password: 'secure',
      });
      expect(handleLogin).toHaveBeenCalledWith('bob', 'secure');
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('displays error message on login failure', async () => {
    const handleLogin = vi.fn(() => Promise.reject(new Error('Invalid credentials')));

    renderModal({
      useAuthHook: { handleLogin, handleRegister: vi.fn() },
    });

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'bad' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeDefined();
    });
  });

  it('shows Processing... while loading', async () => {
    let resolveLogin;
    const handleLogin = vi.fn(() => new Promise((r) => { resolveLogin = r; }));

    renderModal({
      useAuthHook: { handleLogin, handleRegister: vi.fn() },
    });

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'a' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'b' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeDefined();
    });

    resolveLogin();
  });

  it('calls onClose when X button clicked', () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    const closeBtn = document.querySelector('.auth-close');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('clears error when switching between login and register', async () => {
    const handleLogin = vi.fn(() => Promise.reject(new Error('Bad')));

    renderModal({
      useAuthHook: { handleLogin, handleRegister: vi.fn() },
    });

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'x' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'y' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Bad')).toBeDefined();
    });

    fireEvent.click(screen.getByText("Don't have an account? Register"));
    expect(screen.queryByText('Bad')).toBeNull();
  });
});
