import { Email, Phone, Place } from '@mui/icons-material';
import logo from '../../assets/logo_1.png';
function Footer() {
    return (
        <div className='flex flex-col border-t border-primary border-solid bg-white'>
            <div className='flex justify-center items-center'>
                <div className='grid grid-cols-3 w-1200 justify-between gap-4 py-4 '>
                    <div className='flex flex-col gap-4 justify-start'>
                        <div className='flex items-center justify-center'>
                            <img src={logo} alt='logo' className='w-40' />
                        </div>
                        <p className='text-sm'>
                            Established in 2016, LYDINC Vision is to found a leading network of
                            experts to provide services and share knowledge and experiences in
                            innovative and quality education in Vietnam, Southeast Asia and
                            globally.
                        </p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='flex flex-col gap-3'>
                            <h2 className='font-semibold text-primary text-xl mb-4'>Contact us:</h2>
                            <div className='flex gap-2 items-center'>
                                <Place htmlColor='#b39858' />:
                                <p className='font-semibold'>
                                    3rd floor, 53 Nguyen Chi Thanh, Da Nang
                                </p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <Email htmlColor='#b39858' />:
                                <a className='font-semibold' href='mailto:contact@lydinc.net'>
                                    contact@lydinc.net
                                </a>
                            </div>

                            <div className='flex gap-2 items-center'>
                                <Phone htmlColor='#b39858' />:
                                <a className='font-semibold' href='tel:+84899001168'>
                                    0899 001 168
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div>
                            <h2 className='font-semibold text-primary text-xl mb-4'>Location:</h2>
                            <iframe
                                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.044308755954!2d108.2204106!3d16.077062400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142191f0f2ea5ad%3A0x5d6b664ad0171071!2sLYDINC%20Maker%20Innovation%20Space%20-%20Kh%C3%B4ng%20gian%20s%C3%A1ng%20ch%E1%BA%BF%20LYDINC!5e1!3m2!1svi!2s!4v1736482455489!5m2!1svi!2s'
                                width='250'
                                height='190'
                                style={{ border: '0' }}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-gray-800 flex justify-center items-center py-6 text-white'>
                Copyright belongs to LYDINC QA LEARNING | Provided LYDINC Company
            </div>
        </div>
    );
}

export default Footer;
