import type { Meta, StoryObj } from "@storybook/react";

import { ToastStory } from "./ToastStory";

const meta: Meta<typeof ToastStory> = {
  component: ToastStory,
  args: {
    position: "top-right",
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

export default meta;

type Story = StoryObj<typeof ToastStory>;

export const Default: Story = {};
