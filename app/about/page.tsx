export const metadata = {
    title: "About"
};

export default function AboutPage() {
    return (
        <section>
            <div className='space-y-3'>
                <h1 className='text-2xl font-semibold tracking-tight'>
                    About
                </h1>
                <p className='max-w-md text-neutral-600 dark:text-neutral-400'>
                    Vince Lapore is a developer and artist working at the intersection
                    of technology and performance.
                </p>
            </div>
        </section>
    );
}
