import { appContext } from 'context/AppContext';
import { BuildingResponse } from 'models/http/responses/building.response.models';
import { useContext, useEffect, useState } from 'react';
import { sortBuildingsResponse } from 'utils/buildings/building.sorter';
import useBuildingsService from './API/services/useBuildingsService';

const useAllowedBuildings = () => {
  const buildingsService = useBuildingsService();
  const [loading, setLoading] = useState(false);
  const [allowedBuildings, setAllowedBuildings] = useState<
    Array<BuildingResponse>
  >([]);
  const { loggedUser } = useContext(appContext);

  useEffect(() => {
    const getAllowedBuildings = async () => {
      setLoading(true);
      if (loggedUser) {
        if (loggedUser.is_admin) {
          await buildingsService.getMyBuildings().then((response) => {
            setAllowedBuildings(response.data.sort(sortBuildingsResponse));
          });
        } else {
          setAllowedBuildings(loggedUser.buildings || []);
        }
      }
      setLoading(false);
    };
    getAllowedBuildings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

  return { allowedBuildings, loading };
};

export default useAllowedBuildings;
