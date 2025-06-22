interface Config {
  API_BASE_URL: string;
}

const config: Config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5075/api'
};

export const { API_BASE_URL } = config; 