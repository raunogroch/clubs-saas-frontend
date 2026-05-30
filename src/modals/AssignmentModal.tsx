export const AssignmentModal = () => {
  return (
    <div
      className="modal inmodal"
      id="myModal2"
      //   tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content animated flipInY">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">Modal title</h4>
            <small className="font-bold">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </small>
          </div>
          <div className="modal-body">
            <p>
              <strong>Lorem Ipsum is simply dummy</strong> text of the printing
              and typesetting industry. Lorem Ipsum has been the industry's
              standard dummy text ever since the 1500s, when an unknown printer
              took a galley of type and scrambled it to make a type specimen
              book. It has survived not only five centuries, but also the leap
              into electronic typesetting, remaining essentially unchanged.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-white"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
