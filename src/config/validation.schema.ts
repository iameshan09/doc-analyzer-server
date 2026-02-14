import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'stagging')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DB_CONNECTION_URL: Joi.string().uri().required(),
  CORE_REDIS_HOST: Joi.string()
    .trim()
    .required()
    .when('NODE_ENV', {
      is: Joi.valid('production', 'stagging'),
      then: Joi.string().trim().required(),
      otherwise: Joi.string().trim().optional(),
    }),
  CORE_REDIS_PORT: Joi.number()
    .required()
    .when('NODE_ENV', {
      is: Joi.valid('production', 'stagging'),
      then: Joi.number().required(),
      otherwise: Joi.number().optional(),
    }),
  CORE_REDIS_PASSWORD: Joi.string()
    .trim()
    .required()
    .when('NODE_ENV', {
      is: Joi.valid('production', 'stagging'),
      then: Joi.string().trim().required(),
      otherwise: Joi.string().trim().optional(),
    }),
  JWT_SECRET: Joi.string().trim().required(),
  BCRYPT_SALT_ROUNDS: Joi.number().required(),

  APP_BASEURL: Joi.string().trim().required().when('NODE_ENV', {
    not: 'development',
    then: Joi.string().trim().required(),
    otherwise: Joi.string().trim().optional(),
  }),
  // GOOGLE_API_KEY: Joi.string().required(),
  // SMTP_HOST: Joi.string().trim().required(),
  // SMTP_PORT: Joi.number().required(),
  // SMTP_PASS: Joi.string().trim().required(),
  // SMTP_USER: Joi.string().trim().required(),
  // ADMIN_CLIENT_APP_BASEURL: Joi.string().trim().required(),
  // CLIENT_APP_BASEURL: Joi.string().trim().required(),
  // S3_BUCKET: Joi.string().trim().required(),
  // S3_BUCKET_PUBLIC_ACCESS_BASE_URL: Joi.string().uri().trim().required(),
  // SES_SOURCE_EMAIL: Joi.string().email().trim().required(),
});

export default validationSchema;
