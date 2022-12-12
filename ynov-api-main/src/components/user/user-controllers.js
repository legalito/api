import UserModel from '#components/user/user-model.js'
import ListModel from '#components/list/list-model.js'
import Joi from 'joi'
import argon2 from 'argon2'
import { sendWelcomeEmail } from '#services/mailing/welcome-email.js'

export async function register (ctx) {
 try {
  const registerValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    terms_and_conditions: Joi.boolean().valid(true).required()
  })
  const params = ctx.request.body
  const { error, value } = registerValidationSchema.validate(params)
  if(error) throw new Error(error)
  const hashedPassword = await argon2.hash(value.password)
  const newUser = new UserModel({
    ...value,
    password: hashedPassword,
    settings: {
      terms_and_conditions: value.terms_and_conditions
    }
  })
  newUser.generateEmailVerificationToken()
  const user = await newUser.save()
  await sendWelcomeEmail(user, user.settings.validation_email_token)
  const token = user.generateJWT()
  ctx.ok({ token })
 } catch(e) {
  ctx.badRequest({ message: e.message })
 }
}


export async function login (ctx) {
  try {
    const param = ctx.request.body;
    const user = await UserModel.findOne({ email:param.email }).select("password");
    
    console.log(param.password);
    if (!user) {
      throw new Error('Aucun utilisateur avec cette adresse email n\'a été trouvé');
    }

    const passwordMatch = await argon2.verify(user.password,param.password);

    if (!passwordMatch) {
      throw new Error('Le mot de passe est incorrect');
    }
    const token = user.generateJWT();
    ctx.ok({ token })
      
  } catch (err) {
    throw err;
  }
}

export async function profile (ctx) {
  ctx.ok(ctx.state.user);
}