import {
  RiDiscordLine,
  RiExternalLinkLine,
  RiGithubLine,
  RiMailSendLine,
  RiTwitterLine,
  RuiPlugin,
} from '@rotki/ui-library';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(RuiPlugin, {
    mode: 'light',
    icons: [
      RiExternalLinkLine,
      RiGithubLine,
      RiTwitterLine,
      RiDiscordLine,
      RiMailSendLine,
    ],
  });
});
