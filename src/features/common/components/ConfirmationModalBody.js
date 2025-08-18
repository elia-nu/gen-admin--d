function ConfirmationModalBody({ text, handleYes, closeModal, id }) {
  return (
    <>
      <p className="text-xl mt-8 text-center">{text}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline" onClick={() => closeModal()}>
          Cancel
        </button>
        <button className="btn btn-primary w-36" onClick={() => handleYes(id)}>
          Confirm
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;
