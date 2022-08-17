import {
  fluentBreadcrumb,
  fluentBreadcrumbItem,
  fluentButton,
  fluentCard,
  fluentDivider,
  fluentOption,
  fluentProgress,
  fluentProgressRing,
  fluentSelect,
  fluentTab,
  fluentTabPanel,
  fluentTabs,
  provideFluentDesignSystem,
} from '@fluentui/web-components';

provideFluentDesignSystem().register(
  fluentButton(),
  fluentProgress({
    indeterminateIndicator1: `...progress indicator...`,
    indeterminateIndicator2: `...progress indicator...`,
  }),
  fluentProgressRing(),
  fluentCard(),
  fluentDivider(),
  fluentOption(),
  fluentSelect(),
  fluentBreadcrumb(),
  fluentBreadcrumbItem({
    separator: ' -> ',
  }),
  fluentTab(),
  fluentTabPanel(),
  fluentTabs(),
);
