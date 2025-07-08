import { Dialog, DialogBody, IconButton } from "@material-tailwind/react";
import ChatApp from "./ChatApp";

export default function ModalChat({ open, onClose, currentUser, friend }) {
    return (
        <Dialog
            open={open}
            handler={onClose}
            size="xl"
            className="fixed bottom-6 right-4 w-full max-w-[450px] bg-[#1e293b] rounded-2xl p-4"
        >
            <IconButton
                size="sm"
                color="blue-gray"
                onClick={onClose}
                className="!absolute top-2 right-2 bg-gray-700 text-white"
            >
                ✕
            </IconButton>

            <DialogBody className="p-0">
                {friend ? (
                    <ChatApp currentUser={currentUser} friend={friend} />
                ) : (
                    <p className="text-white text-center py-10">
                        Selecciona un amigo para chatear
                    </p>
                )}
            </DialogBody>
        </Dialog>
    );
}
