import { Dialog, DialogBody, IconButton } from "@material-tailwind/react";
import ChatApp from "./ChatApp";

export default function ModalChat({ open, onClose, currentUser, friend }) {
    return (
        <Dialog
            open={open}
            handler={onClose}
            className={`
                fixed bottom-0 right-0 left-0 top-0
                sm:bottom-6 sm:right-4 sm:left-auto sm:top-auto
                w-full sm:w-auto
                max-w-full sm:max-w-[450px]
                h-full sm:h-[500px] sm:max-h-[90vh]
                bg-[#1e293b]
                rounded-none sm:rounded-2xl
                p-2 sm:p-4 m-0
                shadow-lg border border-gray-700
            `}
        >
            {/* Botón de cerrar */}
            <IconButton
                size="sm"
                color="blue-gray"
                onClick={onClose}
                className="!absolute top-2 right-2 bg-gray-700 text-white z-50"
            >
                ✕
            </IconButton>

            {/* Contenido del chat */}
            <DialogBody className="p-0 h-full overflow-hidden">
                {friend ? (
                    <ChatApp currentUser={currentUser} friend={friend} />
                ) : (
                    <div className="text-white text-center py-10">
                        Selecciona un amigo para chatear
                    </div>
                )}
            </DialogBody>
        </Dialog>
    );
}
