package AssetTrack.service;

import AssetTrack.dto.SetorRequestDTO;
import AssetTrack.dto.SetorResponseDTO;
import AssetTrack.model.Setor;
import AssetTrack.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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

    public SetorResponseDTO atualizar(UUID id, SetorRequestDTO data) {
        Setor setor = setorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setor não encontrado: " + id));

        if (setor.getEquipamentos() != null && !setor.getEquipamentos().isEmpty()) {
            throw new IllegalStateException("Setor possui equipamentos vinculados e não pode ser editado.");
        }

        setor.setNomeSetor(data.nomeSetor());
        setor.setLocalizacaoFisica(data.localizacaoFisica());
        setorRepository.save(setor);
        return new SetorResponseDTO(setor);
    }

    public void deletar(UUID id) {
        Setor setor = setorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Setor não encontrado: " + id));

        if (setor.getEquipamentos() != null && !setor.getEquipamentos().isEmpty()) {
            throw new IllegalStateException("Setor possui equipamentos vinculados e não pode ser excluído.");
        }

        setorRepository.delete(setor);
    }

    public List<SetorResponseDTO> listarTodos() {
        return setorRepository.findAll().stream()
                .map(SetorResponseDTO::new)
                .toList();
    }
}