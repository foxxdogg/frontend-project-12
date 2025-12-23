import * as Yup from 'yup'
import leoProfanity from 'leo-profanity'

const getLoginSchema = t => Yup.object({
  username: Yup.string().required(t('required')),
  password: Yup.string().required(t('required')),
})

const getSignupSchema = t => Yup.object({
  username: Yup.string().min(3, t('range')).max(20, t('range')).required(t('required')),
  password: Yup.string().min(6, t('minLength')).required(t('required')),
  confirmation: Yup
    .string()
    .oneOf([Yup.ref('password')], t('passwordMatch'))
    .required(t('required')),
})

const getSchema = (t, channels) => Yup.object({
  name: Yup
    .string()
    .min(3, t('range'))
    .max(20, t('range'))
    .required(t('required'))
    .test(
      'unique',
      t('notUniq'),

      (value) => {
        if (!value) return false
        const cleanValue = leoProfanity.clean(value).trim().toLowerCase()
        return !channels.some(c => leoProfanity.clean(c.name).trim().toLowerCase() === cleanValue)
      },
    ),
})

export { getLoginSchema, getSignupSchema, getSchema }
