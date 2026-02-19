import { MessageCircle, Eye, Users, Star, Settings } from 'lucide-react';

export const STATS_CONFIG = [
  { label: 'Total Messages', value: '128', icon: MessageCircle, color: 'blue' },
  { label: 'Unread', value: '12', icon: Eye, color: 'green' },
  { label: 'Anonymous', value: '89', icon: Users, color: 'purple' },
];

export const MENU_ITEMS = [
  { icon: MessageCircle, label: 'Messages', active: true },
  { icon: Star, label: 'Starred', active: false },
  { icon: Settings, label: 'Settings', active: false },
];