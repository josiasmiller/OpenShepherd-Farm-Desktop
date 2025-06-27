import { useNavigate } from "react-router-dom";

import React from "react";
import CollapsibleSection from "../../../components/collapsible/collapsible";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";
import { BirthProcessorResponse } from "../../../../registry/processors/births/birthProcessor";



const RegistryLanding: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [showProccesors, setShowProccesors] = useState(true);

  // const handleBirthNotifications = async () => {
  //   // dont double process
  //   if (isLoading) {
  //     return;
  //   }

  //   setIsLoading(true);
  //   var resp : BirthProcessorResponse = await window.electronAPI.registryProcessBirths();

  //   // handle case where user doesn't select anything from the file dialog
  //   if (resp.didUserCancel) {
  //     setIsLoading(false);
  //   }

  //   if (resp.success) {

  //     Swal.fire({
  //       title: "Success",
  //       text: "PDF saved successfully",
  //       icon: "success",
  //       showCancelButton: true,
  //       confirmButtonText: "Open Folder",
  //       cancelButtonText: "OK",
  //       reverseButtons: true,
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         window.electronAPI.openDirectory(resp.resultingDirectory);
  //       }
  //     });

  //   } else {
  //     Swal.fire({
  //       title: "Error",
  //       text: "There was an error saving the file",
  //       icon: "error",
  //       confirmButtonText: "Continue",
  //     });
  //   }

  //   setIsLoading(false);
  // };

  const handleBirthNotifications = () => {
    if (isLoading) return;

    navigate('/registry/preprocess/births');
  };



  return (
    <div>
      <CollapsibleSection
        title="Processors"
        isOpen={showProccesors}
        onToggle={() => setShowProccesors(!showProccesors)}
      >
        <div className="action-buttons registry-section">
          <button className="forward-button" onClick={handleBirthNotifications}>
            Handle Birth Notifications
          </button>

        </div>
      </CollapsibleSection>

      <LoadingIndicator
        isLoading={isLoading}
        message="Processing..."
      />
      
    </div>
  );
};

export default RegistryLanding;
