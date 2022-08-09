import {
  fluentButton,
  fluentProgress,
  fluentProgressRing,
  fluentCard,
  fluentBreadcrumb,
  fluentBreadcrumbItem,
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
  fluentBreadcrumb(),
  fluentBreadcrumbItem({
    separator: ' -> ',
  }),
);
