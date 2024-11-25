import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader.tsx";
import EmptyState from "../../../../components/EmptyState.tsx";
import FormModal from "../../../../components/FormModal.tsx";
import { useEffect, useRef, useState } from "react";
import DiscountForm from "./DiscountsForm.tsx";
import DiscountList from "./DiscountsList.tsx";
import { Discount, DiscountFormAction } from "../../../../types/discounts.ts";
import { useAppDispatch } from "../../../../store/hooks.ts";
import { setPageName } from "../../../../store/app.slice.ts";
import SuccessModal from "../../../../components/SuccessModal.tsx";
import {
  useAddDiscountMutation,
  useGetDiscountsQuery,
} from "../../../../store/api/discounts.api.ts";

const DiscountsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [discountName, setDiscountName] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState<Discount>();
  const { data: discounts } = useGetDiscountsQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addDiscount] = useAddDiscountMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Fees Management / Discount & Condition"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedDiscount(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddDiscount = async (discount: Discount) => {
    try {
      await addDiscount(discount).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setDiscountName(`${discount.description}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <DiscountForm
          actions={{
            submit: handleAddDiscount as DiscountFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          discount={selectedDiscount}
        />
      </FormModal>

      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedDiscount(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new discount "${discountName}".`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Discounts",
        }}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        {discounts?.data && discounts.data.length > 0 ? (
          <DiscountList />
        ) : (
          <EmptyState
            title="No Discounts at this time"
            subTitle="Discounts will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default DiscountsPage;
