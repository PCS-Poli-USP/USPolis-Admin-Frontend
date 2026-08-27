import useCustomToast from '../hooks/useCustomToast';
import {
  CreateBuilding,
  UpdateBuilding,
} from '../models/http/requests/building.request.models';
import { BuildingResponse } from '../models/http/responses/building.response.models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { sortBuildingsResponse } from '../utils/buildings/building.sorter';
import useBuildingsService from './API/services/useBuildingsService';
import BuildingErrorParser from './buildingErrorParser';

const useBuildings = (initialFetch = true) => {
  const service = useBuildingsService();
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);

  const showToast = useCustomToast();
  const parser = useMemo(() => new BuildingErrorParser(), []);

  const getAllBuildings = useCallback(async () => {
    setLoading(true);
    await service
      .getAll()
      .then((response) => {
        setBuildings(response.data.sort(sortBuildingsResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const getBuildings = useCallback(async () => {
    setLoading(true);
    await service
      .getMyBuildings()
      .then((response) => {
        setBuildings(response.data.sort(sortBuildingsResponse));
      })
      .catch((error) => {
        showToast('Erro', parser.parseGetError(error), 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [showToast, service, parser]);

  const createBuilding = useCallback(
    async (data: CreateBuilding) => {
      setLoading(true);
      await service
        .create(data)
        .then(() => {
          showToast(
            'Sucesso',
            `Prédio ${data.name} criado com sucesso!`,
            'success',
          );
          getBuildings();
        })
        .catch((error) => {
          showToast('Erro', parser.parseCreateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getBuildings, showToast, service, parser],
  );

  const updateBuilding = useCallback(
    async (id: number, data: UpdateBuilding) => {
      setLoading(true);
      await service
        .update(id, data)
        .then(() => {
          showToast('Sucesso', `Prédio atualizado com sucesso!`, 'success');
          getBuildings();
        })
        .catch((error) => {
          showToast('Erro', parser.parseUpdateError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getBuildings, showToast, service, parser],
  );

  const deleteBuilding = useCallback(
    async (id: number) => {
      setLoading(true);
      await service
        .deleteById(id)
        .then(() => {
          showToast('Sucesso!', 'Sucesso ao remover prédio', 'success');

          getBuildings();
        })
        .catch((error) => {
          showToast('Erro!', parser.parseDeleteError(error), 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [getBuildings, showToast, service, parser],
  );

  useEffect(() => {
    if (initialFetch) getBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    buildings,
    getBuildings,
    getAllBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
  };
};

export default useBuildings;
