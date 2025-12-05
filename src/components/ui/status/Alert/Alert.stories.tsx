import type { Meta, StoryObj } from "@storybook/react";

import { CheckIcon } from "@/assets/icons/general/Check";

import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  component: Alert,
  args: {},
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    text: "This is a default sample of text, in order to display the default.",
    icon: CheckIcon,
    actions: [
      {
        text: "Action 1",
        onPress: () => {},
      },
      {
        text: "Action 2",
        onPress: () => {},
      },
    ],
  },
};

export const NoActions: Story = {
  args: {
    text: "This is a default sample of text, in order to display the default.",
    icon: CheckIcon,
  },
};

export const NoIcon: Story = {
  args: {
    text: "This is a default sample of text, in order to display the default.",
    actions: [
      {
        text: "Action 1",
        onPress: () => {},
      },
      {
        text: "Action 2",
        onPress: () => {},
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    text: "This is a default sample of text, in order to display the default.",
    isLoading: true,
    icon: CheckIcon,
  },
};
