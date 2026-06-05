package AssetTrack.service;

import AssetTrack.dto.SetorRequestDTO;
import AssetTrack.dto.SetorResponseDTO;
import AssetTrack.model.Setor;
import AssetTrack.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SetorService {

    @Autowired
    private SetorRepository setorRepository;

    public SetorResponseDTO cadastrar(SetorRequestDTO data) {
        Setor setor = new Setor();
        setor.setNomeSetor(data.nomeSetor());
        setor.setLocalizacaoFisica(data.localizacaoFisica());

        setorRepository.save(setor);
        return new SetorResponseDTO(setor);
    }

    public List<SetorResponseDTO> listarTodos() {
        return setorRepository.findAll().stream()
                .map(SetorResponseDTO::new)
                .toList();
    }
}