const allowedOrigins = [
 'http://localhost:8080',
 'http://localhost:8082',
 'https://id-preview--e2596c08-fd4c-4e6c-8976-e2a5bbb16a7b.lovable.app'
];

export const corsOptions = {
 origin: function (origin, callback) {
  if (!origin) return callback(null, true);

  if (allowedOrigins.includes(origin)) {
   callback(null, true);
  } else {
   callback(new Error("Not allowed by CORS"));
  }
 },
 credentials: true
};