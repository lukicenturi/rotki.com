import {
  RiArrowDropRightLine,
  RiDiscordLine,
  RiExternalLinkLine,
  RiGithubLine,
  RiLightbulbLine,
  RiLogoutBoxRLine,
  RiMailSendLine,
  RiTwitterLine,
  RuiPlugin,
} from '@rotki/ui-library';
import '@fontsource/roboto/latin.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(RuiPlugin, {
    mode: 'light',
    icons: [
      RiArrowDropRightLine,
      RiDiscordLine,
      RiExternalLinkLine,
      RiGithubLine,
      RiLightbulbLine,
      RiLogoutBoxRLine,
      RiMailSendLine,
      RiTwitterLine,
    ],
  });
});
