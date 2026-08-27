import { appContext } from '../context/AppContext';
import { BuildingResponse } from '../models/http/responses/building.response.models';
import { useContext, useEffect, useState } from 'react';
import { sortBuildingsResponse } from '../utils/buildings/building.sorter';
import useBuildingsService from './API/services/useBuildingsService';
import useCustomToast from './useCustomToast';
import BuildingErrorParser from './buildingErrorParser';

const useAllowedBuildings = () => {
  const buildingsService = useBuildingsService();
  const [loading, setLoading] = useState(false);
  const [allowedBuildings, setAllowedBuildings] = useState<
    Array<BuildingResponse>
  >([]);
  const { loggedUser } = useContext(appContext);
  const showToast = useCustomToast();
  const parser = new BuildingErrorParser();

  useEffect(() => {
    const getAllowedBuildings = async () => {
      setLoading(true);
      if (loggedUser) {
        if (loggedUser.is_admin) {
          try {
            const response = await buildingsService.getMyBuildings();
            setAllowedBuildings(response.data.sort(sortBuildingsResponse));
          } catch (error) {
            showToast('Erro', parser.parseGetError(error), 'error');
          }
        } else {
          const buildings = loggedUser.buildings || [];
          setAllowedBuildings(buildings.sort(sortBuildingsResponse));
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
