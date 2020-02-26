import { extend, localize } from 'vee-validate'
import { email, image, max, min, required } from 'vee-validate/dist/rules'
import { dimensions, phoneOrEmail, required_image, url } from '~/util/validation'
import en from 'vee-validate/dist/locale/en.json'

extend('email', email)
extend('image', image)
extend('max', max)
extend('min', min)
extend('required', required)
extend('dimensions', dimensions)
extend('phoneOrEmail', phoneOrEmail)
extend('required_image', required_image)
extend('url', url)

localize({ en })
