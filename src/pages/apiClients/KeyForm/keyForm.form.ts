import * as yup from 'yup';
import moment from 'moment';
import {
  UpdateApiKey,
  UpdateApiKeyRateLimits,
} from '../../../models/http/requests/apiKey.request.models';
import {
  expiryError,
  rateLimitsError,
} from '../../../utils/apiKeys/apiKeys.validator';
import { expiresAtRequest } from '../../../utils/apiKeys/apiKeys.formatter';
import {
  IssueKeyForm,
  KeyConfigForm,
  KeyLimitsForm,
} from './keyForm.interface';

const withMessage =
  <T>(check: (value: T) => string) =>
  (value: T, context: yup.TestContext) => {
    const message = check(value);
    return message ? context.createError({ message }) : true;
  };

export const configShape = {
  name: yup
    .string()
    .trim()
    .required('O nome é obrigatório.')
    .max(256, 'Máximo de 256 caracteres.'),
  expires_on: yup
    .string()
    .defined()
    .test(
      'expiry',
      withMessage<string | undefined>((v) => expiryError(v ?? '')),
    ),
  prefixes: yup
    .array(yup.string().defined())
    .defined()
    .min(1, 'Selecione pelo menos um prefixo.'),
};

export const limitsShape = {
  use_default_limits: yup.boolean().defined(),
  rate_limits: yup
    .array(
      yup.object({
        max_requests: yup.number().defined(),
        window_seconds: yup.number().defined(),
      }),
    )
    .defined()
    .test('rules', function (rules) {
      if (this.parent.use_default_limits) return true;
      const message = rateLimitsError(rules ?? []);
      return message ? this.createError({ message }) : true;
    }),
};

export const configSchema: yup.ObjectSchema<KeyConfigForm> =
  yup.object(configShape);
export const limitsSchema: yup.ObjectSchema<KeyLimitsForm> =
  yup.object(limitsShape);
export const issueSchema: yup.ObjectSchema<IssueKeyForm> = yup.object({
  ...configShape,
  ...limitsShape,
});

export const DEFAULT_CUSTOM_RULE = { max_requests: 60, window_seconds: 60 };

export function issueDefaultValues(): IssueKeyForm {
  return {
    name: '',
    expires_on: moment().add(90, 'days').format('YYYY-MM-DD'),
    prefixes: [],
    use_default_limits: true,
    rate_limits: [DEFAULT_CUSTOM_RULE],
  };
}

export function configToRequest(form: KeyConfigForm): UpdateApiKey {
  return {
    name: form.name.trim(),
    allowed_path_prefixes: form.prefixes,
    expires_at: expiresAtRequest(form.expires_on),
  };
}

export function limitsToRequest(form: KeyLimitsForm): UpdateApiKeyRateLimits {
  return {
    rate_limits: form.use_default_limits
      ? []
      : form.rate_limits.map((r) => ({
          max_requests: Number(r.max_requests),
          window_seconds: Number(r.window_seconds),
        })),
  };
}
