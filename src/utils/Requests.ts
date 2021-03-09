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
  password: string,
  birthday: Date
) {
  const { data } = await axios.post('/api/signup', {
    username,
    email,
    password,
    birthday,
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
export async function getUserInfo() {
  const { data } = (await axios.get('/api/info')).data;
  return data;
}
export async function saveMoney(amount: number): Promise<boolean> {
  const { success, error } = (
    await axios.post('/api/topup', {
      amount,
    })
  ).data;
  if (!success) {
    throw error.message;
  }
  return true;
}
export async function getAllProducts() {
  const { success, data, error } = (await axios.get('/api/product')).data;
  if (!success) {
    throw error.message;
  }
  return data;
}
export async function getInvestedProducts() {
  const { success, data, error } = (await axios.get('/api/owned')).data;
  if (!success) {
    throw error.message;
  }
  return data;
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const { success, error } = (
    await axios.put('/api/changepwd', { oldPassword, newPassword })
  ).data;
  if (!success) {
    throw error.message;
  }
  return true;
}
