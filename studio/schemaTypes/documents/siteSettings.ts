import { defineArrayMember, defineField, defineType } from 'sanity';
import { SITE_SETTINGS_SOURCE_KEY, validateSiteSettings } from '../../../src/sanity/siteSettingsValidation';

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({ name: 'sourceKey', type: 'string', initialValue: SITE_SETTINGS_SOURCE_KEY, readOnly: true }),
    defineField({ name: 'wordmark', type: 'string', validation: rule => rule.required() }),
    defineField({
      name: 'contactEmail', title: 'Contact email', type: 'string',
      description: 'Enter a mailbox such as hello@example.com.', validation: rule => rule.required(),
    }),
    defineField({ name: 'footerSignoff', title: 'Footer sign-off', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'footerMeta', title: 'Footer metadata', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'footerColophon', title: 'Footer colophon', type: 'string', validation: rule => rule.required() }),
    defineField({
      name: 'socialLinks', title: 'Social links', type: 'array',
      of: [defineArrayMember({
        name: 'socialLink', type: 'object', title: 'Social link',
        fields: [
          defineField({ name: 'label', type: 'string', validation: rule => rule.required() }),
          defineField({
            name: 'href', title: 'Destination', type: 'string',
            description: 'Use an HTTPS URL or the placeholder #.', validation: rule => rule.required(),
          }),
        ],
        preview: { select: { title: 'label', subtitle: 'href' } },
      })],
    }),
  ],
  validation: rule => rule.custom(validateSiteSettings),
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
