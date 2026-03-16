'use client';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export function PageHeader({ title, subtitle, right }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="inline-block nb-surface bg-white px-5 py-4">
          <h1 className="font-heading text-3xl font-black uppercase tracking-wider">
            {title}
          </h1>
        </div>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-sm text-text-secondary">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

