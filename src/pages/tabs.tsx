import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{
                flexGrow: 1, background: 'linear-gradient(to bottom right, #1a0e3f, #a21caf, #2a0a46)',
                display: 'flex', height: 695, justifyContent: 'space-around'
            }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider', height: 695, width: 180, bgcolor: 'white', paddingTop: 10 }}
            >
                <h1 className='text-center font-bold mb-3'>Burn it</h1>
                <Tab label="Item One" {...a11yProps(0)} />
                <Tab label="Item Two" {...a11yProps(1)} />
                <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={1}>
                <Box sx={{ bgcolor: 'white', p: 2, height: 640, width: 1100, display: 'flex', justifyContent: 'center' }}></Box>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Box sx={{ bgcolor: 'white', p: 2, height: 640, width: 1100, display: 'flex', justifyContent: 'center' }}>Item Two</Box>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Box sx={{ bgcolor: 'white', p: 2, height: 640, width: 1100, display: 'flex', justifyContent: 'center' }}>Item Three</Box>
            </TabPanel>

        </Box>
    );
}
