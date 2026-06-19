import { ToastProvider } from '@/network-workbench/components/ui/ToastProvider';

export const metadata = {
  title: 'Network Workbench - EU Support',
};

export default function NetworkLayout({ children }) {
  return (
    <div className="networkWorkbench">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
