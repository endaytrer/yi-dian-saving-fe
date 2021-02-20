import axios from 'axios';
export async function login(identity: string, password: string) {
  const { data } = await axios.post('/api/login', {
    identity,
    password,
  });
  return data;
}
export async function register(
  username: string,
  email: string,
  password: string
) {
  const { data } = await axios.post('/api/signup', {
    username,
    email,
    password,
  });
  return data;
}
export async function logout(): Promise<void> {
  await axios.delete('/api/login');
  return;
}
export async function testLogin(): Promise<boolean> {
  const { success } = (await axios.get('/api/login')).data;
  return success;
}
