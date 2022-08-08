import {
  provideFluentDesignSystem,
  fluentProgress,
  fluentButton,
  fluentSelect,
  fluentOption,
  fluentDivider,
  fluentProgressRing,
} from "@fluentui/web-components";

provideFluentDesignSystem().register(
  fluentProgress(),
  fluentSelect(),
  fluentOption(),
  fluentButton(),
  fluentDivider(),
  fluentProgressRing()
);
