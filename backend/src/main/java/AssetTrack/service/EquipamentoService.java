package AssetTrack.service;

import AssetTrack.dto.EquipamentoRequestDTO;
import AssetTrack.dto.EquipamentoResponseDTO;
import AssetTrack.model.Aquisicao;
import AssetTrack.model.Equipamento;
import AssetTrack.model.Setor;
import AssetTrack.repository.AquisicaoRepository;
import AssetTrack.repository.EquipamentoRepository;
import AssetTrack.repository.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EquipamentoService {

    @Autowired
    private EquipamentoRepository equipamentoRepository;

    @Autowired
    private SetorRepository setorRepository;

    @Autowired
    private AquisicaoRepository aquisicaoRepository;

    public EquipamentoResponseDTO cadastrarEquipamento(EquipamentoRequestDTO data) {
        if (data.numeroSerie() != null && !data.numeroSerie().isEmpty()) {
            if (equipamentoRepository.findByNumeroSerie(data.numeroSerie()).isPresent()) {
                throw new IllegalArgumentException("Já existe um equipamento cadastrado com este número de série.");
            }
        }

        Equipamento equipamento = new Equipamento();
        equipamento.setNomeEquipamento(data.nomeEquipamento());
        equipamento.setNumeroSerie(data.numeroSerie());
        equipamento.setStatusAtual("ATIVO");
        equipamento.setDataCadastro(LocalDateTime.now());

        if (data.idSetor() != null) {
            Setor setor = setorRepository.findById(data.idSetor())
                    .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado."));
            equipamento.setSetor(setor);
        } else {
            throw new IllegalArgumentException("O equipamento precisa ser alocado a um setor inicial.");
        }

        if (data.idAquisicao() != null) {
            Aquisicao aquisicao = aquisicaoRepository.findById(data.idAquisicao())
                    .orElseThrow(() -> new IllegalArgumentException("Registro de aquisição não encontrado."));
            equipamento.setAquisicao(aquisicao);
        }

        equipamentoRepository.save(equipamento);
        return new EquipamentoResponseDTO(equipamento);
    }

    public List<EquipamentoResponseDTO> listarTodos() {
        return equipamentoRepository.findAll().stream()
                .map(EquipamentoResponseDTO::new)
                .toList();
    }

    public EquipamentoResponseDTO atualizarEquipamento(UUID id, EquipamentoRequestDTO data) {
        Equipamento equipamento = equipamentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        if (data.numeroSerie() != null && !data.numeroSerie().isEmpty() && !data.numeroSerie().equals(equipamento.getNumeroSerie())) {
            if (equipamentoRepository.findByNumeroSerie(data.numeroSerie()).isPresent()) {
                throw new IllegalArgumentException("Já existe um equipamento cadastrado com este número de série.");
            }
        }

        equipamento.setNomeEquipamento(data.nomeEquipamento());
        equipamento.setNumeroSerie(data.numeroSerie());

        if (data.idSetor() != null) {
            Setor setor = setorRepository.findById(data.idSetor())
                    .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado."));
            equipamento.setSetor(setor);
        }

        if (data.idAquisicao() != null) {
            Aquisicao aquisicao = aquisicaoRepository.findById(data.idAquisicao())
                    .orElseThrow(() -> new IllegalArgumentException("Registro de aquisição não encontrado."));
            equipamento.setAquisicao(aquisicao);
        } else {
            equipamento.setAquisicao(null);
        }

        equipamentoRepository.save(equipamento);
        return new EquipamentoResponseDTO(equipamento);
    }

    public void deletarEquipamento(UUID id) {
        Equipamento equipamento = equipamentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        if ("INATIVO".equals(equipamento.getStatusAtual())) {
            throw new IllegalArgumentException("Este equipamento já se encontra inativo no sistema.");
        }

        equipamento.setStatusAtual("INATIVO");
        equipamentoRepository.save(equipamento);
    }
}