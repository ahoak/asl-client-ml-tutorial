import {
  provideFluentDesignSystem,
  fluentProgress,
  fluentButton,
  fluentSelect,
  fluentOption,
  fluentDivider,
} from "@fluentui/web-components";

provideFluentDesignSystem().register(
  fluentProgress(),
  fluentSelect(),
  fluentOption(),
  fluentButton(),
  fluentDivider()
);
