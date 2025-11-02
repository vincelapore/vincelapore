export const metadata = {
    title: "Contact"
};

const contacts = [
    {
        label: "Email",
        value: "vincelapore@icloud.com",
        href: "mailto:vincelapore@icloud.com"
    },
    {
        label: "Instagram",
        value: "@vince.lapore",
        href: "https://www.instagram.com/vince.lapore/"
    }
];

export default function ContactPage() {
    return (
        <section>
            <div className='space-y-3'>
                <h1 className='text-2xl font-semibold tracking-tight'>
                    Contact
                </h1>
                <p className='max-w-md text-neutral-600 dark:text-neutral-400'>
                    Touring, rehearsal tooling, or something new—drop a line and
                    we&rsquo;ll make time.
                </p>
            </div>

            <ul className='space-y-3'>
                {contacts.map((contact) => (
                    <li key={contact.label}>
                        <a
                            href={contact.href}
                            className='block rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900'
                        >
                            <p className='text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400'>
                                {contact.label}
                            </p>
                            <p className='text-lg font-semibold text-neutral-800 dark:text-neutral-100'>
                                {contact.value}
                            </p>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
