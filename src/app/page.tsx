import Footer from '@/components/Footer';
import Header from '../components/header';
import EditorContainer from '../containers/EditorContainer';

export default function Home() {
    return (
        <div className='flex min-h-screen flex-col justify-between overflow-hidden'>
            <Header />
            <main className='mt-[--header-size] flex h-[calc(100%-8rem)] grow overflow-hidden md:h-[calc(100%-9rem)]'>
                <EditorContainer />
            </main>
            <Footer />
        </div>
    );
}
