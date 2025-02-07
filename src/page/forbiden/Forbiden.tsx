import { Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

function Forbiden() {
    return (
        <Group h={'100vh'} w={'100%'} justify='center' align='center'>
            <Group w={'100%'}>
                <Text size='100px' c={'gray'} fw={'bold'}>
                    403
                </Text>
                <Text c={'gray'}>Forbiden</Text>
            </Group>
            <Link to={'/'} className='primary-btn'>
                Go back to home page
            </Link>
        </Group>
    );
}

export default Forbiden;
