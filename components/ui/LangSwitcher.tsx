'use client';
import { ChangeEvent, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const LangSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      // Update the locale without redirecting
      const currentPath = window.location.pathname.split('/').slice(2).join('/'); // Preserve the current path after the locale
      router.replace(`/${nextLocale}/${currentPath}`);
    });
  };

  // Effect to handle locale change
  useEffect(() => {
    // This will force a re-render when the locale changes
    router.refresh();
  }, [localActive, router]);

  return (
    <label className='border-2 rounded'>
      <select
        defaultValue={localActive}
        className='bg-transparent py-2'
        onChange={onSelectChange}
        disabled={isPending}>
        <option value='en'>EN</option>
        <option value='ar'>AR</option>
      </select>
    </label>
  );
};

export default LangSwitcher;
