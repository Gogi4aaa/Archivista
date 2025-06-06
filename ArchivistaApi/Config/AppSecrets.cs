namespace ArchivistaApi.Config
{
    public class AppSecrets
    {
        public DatabaseConfig Database { get; set; }
        public JwtConfig Jwt { get; set; }
    }

    public class DatabaseConfig
    {
        public string Host { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int Port { get; set; }

        public string GetConnectionString()
        {
            return $"Host={Host};Port={Port};Database={Name};Username={Username};Password={Password}";
        }
    }
} 