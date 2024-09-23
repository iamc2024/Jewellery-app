import { Button } from '@/components/ui/button';
import { File, FilePlus2Icon, LucideUsers2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MenuBarProps {
  className?: string;
}

const Menubar = ({ className }: MenuBarProps) => {
  const menuItems = [
    {
      href: '/',
      icon: <FilePlus2Icon className="text-black" />,
      label: 'Create Invoice',
    },
    {
      href: '/invoices',
      icon: <File className="text-black" />,
      label: 'Invoice',
    },
    {
      href: '/customers',
      icon: <LucideUsers2 />,
      label: 'Customers',
    },
    {
      href: '/newCustomer',
      icon: <UserPlus />,
      label: 'New Customer',
    },
  ];

  return (
    <div className={className}>
      {menuItems.map((item) => {
        
        return (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              'flex items-center justify-start gap-1 lg:gap-3 bg-gray-100 text-black'
            )}
            title={item.label}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              <span className="hidden font-bold lg:inline">
                {item.label}
              </span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

export default Menubar;
