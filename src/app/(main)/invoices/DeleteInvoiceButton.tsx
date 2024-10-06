import LoadingButton from "@/components/LoadingButton";
import kyInstance from "@/lib/ky";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

interface DeleteInvoiceButtonProps {
    invoiceId: string;
}

const DeleteInvoice = ({ invoiceId }: DeleteInvoiceButtonProps) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const deleteInvoice = async (id: string) => {
        setIsDeleting(true);
        try {
           await kyInstance.delete(`/api/invoices/${id}`);
           window.location.reload(); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <LoadingButton
            loading={isDeleting}
            onClick={() => deleteInvoice(invoiceId)}
            className=' text-xs px-2 hidden sm:inline-block self-end'
        >
            <Trash2Icon size={16} className='mr-1' />
        </LoadingButton>
    );
}

export default DeleteInvoice;