import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  component: Link,
  args: {
    children: "A link",
    href: "https://google.com",
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};
