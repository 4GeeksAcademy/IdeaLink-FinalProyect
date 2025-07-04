import './Feed_central.css'
import { Avatar } from "@material-tailwind/react";


import { Card, Typography, Button } from "@material-tailwind/react";

export default function Tarjeta() {
    return (
        <Card className="flex h-full w-full max-w-[48rem] rounded-[1vw] bg-gray-600 mx-2 py-2 px-4 text-white text-center text-sm ">
            <Card.Header className="m-0 h-full w-5/5 shrink-0 rounded-r-none bg-gray-600 shadow-none">

                <div className="flex items-center gap-4 w-[50px] h-[50px]  ">
                    <Avatar className='rounded-full' src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/ct-assets/team-4.jpg" alt="avatar" />
                    <div className='flex gap-2 justify-around '>
                        <Typography className='w-[100px]'>Tania Andrew</Typography>
                    </div>
                    <div className='flex gap-2 ms-87 '>
                        <button className='rounded-full bg-white  py-1 px-2 text-black text-center text-sm'>#cosas</button>
                        <button className='rounded-full bg-white  py-1 px-2 text-black text-center text-sm'>#cosas</button>
                        <button className='rounded-full bg-white  py-1 px-2 text-black text-center text-sm'>#cosas</button>
                    </div>
                </div>
                <div className='mt-2 flex ps-11'>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, debitis.</p>
                </div>
            </Card.Header>

            <Card.Body className="p-4 ">
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                    alt="card-image"
                    className="h-[200px] w-[650px] object-cover mt-1 rounded-[1vw] ms-7 "
                />

            </Card.Body>
            <Card.Footer className='flex justify-end p-1 gap-2'>
                <Button as="a" href="#" className="mb-2 flex w-fit jus gap-2">
                    Learn More
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                    </svg>
                </Button>
                <Button as="a" href="#" className="mb-2 flex w-fit jus gap-2">
                    Postularse
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                    </svg>
                </Button>
            </Card.Footer>
        </Card>
    );
}
