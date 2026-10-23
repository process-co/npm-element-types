import { publishedElementLocalKey } from './published-element-key';

it.each([
  ['-1crm', '_1crm-create-contact', 'create-contact'],
  ['_1crm', '_1crm-create-contact', 'create-contact'],
  ['acme_mail', 'acme-mail-send_message', 'send_message'],
  ['acme_mail', 'acme_mail-send_message', 'send_message'],
  ['acme_mail', 'acme-mailer-send', 'acme-mailer-send'],
  ['acme_mail', 'other-send', 'other-send'],
  ['acme_mail', 'acme-mail-', 'acme-mail-'],
  ['', 'send_message', 'send_message'],
])('maps namespace %s and key %s to exact local key %s', (namespace, key, expected) => {
  expect(publishedElementLocalKey(namespace, key)).toBe(expected);
});
